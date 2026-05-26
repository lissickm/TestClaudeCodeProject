import type { ClicktimeData } from './clicktimeData'

function toCode(name: string): string {
  return name
    .split(/[\s\-\/]+/)
    .filter((w) => w.length > 2)
    .map((w) => w[0].toUpperCase())
    .join('')
    .slice(0, 4)
}

export function openPrintTemplate(data?: ClicktimeData) {
  const clients  = data?.clients  ?? []
  const projects = data?.projects ?? []
  const tasks    = data?.tasks    ?? []

  const projectCodes = projects.map((p) => ({ code: toCode(p.name), name: p.name, clientId: p.clientId }))
  const taskCodes    = tasks.map((t) => ({ code: toCode(t.name),    name: t.name, clientId: t.clientId }))

  function clientLegendSections() {
    return clients.map((c) => {
      const cCode   = toCode(c.name)
      const cProj   = projectCodes.filter((p) => p.clientId === c.id)
      const cTasks  = taskCodes.filter((t) => t.clientId === c.id)
      return `
        <div class="client-section">
          <h3>${c.name} <span class="code-badge">${cCode}</span></h3>
          ${cProj.length  ? `<p><strong>Projects:</strong> ${cProj.map(p  => `<span class="tag">${p.code} = ${p.name}</span>`).join(' ')}</p>` : ''}
          ${cTasks.length ? `<p><strong>Tasks:</strong>   ${cTasks.map(t => `<span class="tag">${t.code} = ${t.name}</span>`).join(' ')}</p>` : ''}
        </div>`
    }).join('')
  }

  const ROWS = 20
  const blankRows = Array.from({ length: ROWS }).map(() => `
    <tr>
      <td></td><td></td><td></td><td></td>
      <td class="center"></td><td class="center"></td><td></td>
    </tr>`).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>ClickTime Time Entry Form</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Segoe UI", Arial, sans-serif; font-size: 11px; color: #111; padding: 20px 28px; }
    h1 { font-size: 18px; color: #1B5FAB; margin-bottom: 4px; }
    .subtitle { font-size: 11px; color: #555; margin-bottom: 16px; }
    .week-row { display: flex; gap: 40px; margin-bottom: 16px; font-size: 12px; }
    .week-row label { font-weight: 600; }
    .week-row .line { display: inline-block; border-bottom: 1px solid #333; width: 140px; margin-left: 6px; }

    table.entries { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    table.entries th {
      background: #dce6f4; color: #1a3a5c; font-size: 10px; text-transform: uppercase;
      letter-spacing: 0.4px; padding: 5px 6px; border: 1px solid #aac0db; text-align: left;
    }
    table.entries th.right, table.entries td.center { text-align: center; }
    table.entries td { border: 1px solid #ccc; padding: 0; height: 22px; }
    table.entries tr:nth-child(even) td { background: #f7f9fc; }

    .legend-title { font-size: 13px; font-weight: 700; color: #1B5FAB; border-bottom: 2px solid #1B5FAB; padding-bottom: 4px; margin-bottom: 12px; }
    .client-section { margin-bottom: 12px; }
    .client-section h3 { font-size: 11px; font-weight: 700; margin-bottom: 4px; }
    .code-badge { background: #1B5FAB; color: white; border-radius: 3px; padding: 1px 5px; font-size: 10px; margin-left: 4px; }
    .tag { display: inline-block; background: #eef2f9; border: 1px solid #c0d0e8; border-radius: 3px; padding: 1px 5px; margin: 2px 2px; font-size: 10px; }
    .code { font-weight: 700; color: #1B5FAB; }
    table.legend { border-collapse: collapse; margin-bottom: 8px; }
    table.legend td { padding: 2px 8px 2px 0; font-size: 10px; }
    .col-date    { width: 60px; }
    .col-client  { width: 60px; }
    .col-project { width: 70px; }
    .col-task    { width: 70px; }
    .col-hours   { width: 44px; }
    .col-bill    { width: 44px; }
    .col-notes   { width: auto; }

    @media print {
      body { padding: 10px 16px; }
      @page { margin: 12mm; }
    }
  </style>
</head>
<body>
  <h1>ClickTime — Time Entry Form</h1>
  <p class="subtitle">Fill in using shortcodes from the legend below. Use exact codes for fastest processing.</p>

  <div class="week-row">
    <div><label>Week of:</label><span class="line"></span></div>
    <div><label>Name:</label><span class="line"></span></div>
  </div>

  <table class="entries">
    <thead>
      <tr>
        <th class="col-date">Date</th>
        <th class="col-client">Client</th>
        <th class="col-project">Project</th>
        <th class="col-task">Task</th>
        <th class="col-hours right">Hours</th>
        <th class="col-bill right">Billable</th>
        <th class="col-notes">Notes</th>
      </tr>
    </thead>
    <tbody>${blankRows}</tbody>
  </table>

  <div class="legend-title">Shortcode Legend</div>
  ${clientLegendSections() || '<p style="color:#888;font-size:11px">No ClickTime data loaded — open app and wait for data to load before printing.</p>'}

  <script>window.onload = () => window.print()</script>
</body>
</html>`

  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}
