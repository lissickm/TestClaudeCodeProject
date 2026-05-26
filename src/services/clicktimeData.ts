export type ClicktimeClient  = { id: string; name: string }
export type ClicktimeProject = { id: string; name: string; clientId: string }
export type ClicktimeTask    = { id: string; name: string; clientId: string }

export type ClicktimeData = {
  clients:  ClicktimeClient[]
  projects: ClicktimeProject[]
  tasks:    ClicktimeTask[]
}

// Swap this function for a real API call once the token is available.
// Shape of the return must stay the same.
export async function fetchClicktimeData(): Promise<ClicktimeData> {
  await new Promise((r) => setTimeout(r, 600)) // simulate network delay

  return {
    clients: [
      { id: 'c1', name: 'Belmont Partners' },
      { id: 'c2', name: 'Digi-Key' },
      { id: 'c3', name: 'Etiometry' },
      { id: 'c4', name: 'Francis Medical' },
    ],
    projects: [
      { id: 'p1',  name: '005 Agency Marketing',          clientId: 'c1' },
      { id: 'p2',  name: '696 New Business',              clientId: 'c1' },
      { id: 'p3',  name: '698 HR/Professional Development', clientId: 'c1' },
      { id: 'p4',  name: '699 Operations/Strategy',       clientId: 'c1' },
      { id: 'p5',  name: '830 Health Team',               clientId: 'c1' },
      { id: 'p6',  name: '1184 2026 Ongoing PR',          clientId: 'c2' },
      { id: 'p7',  name: '1185 2026 Ongoing Etiometry PR', clientId: 'c3' },
      { id: 'p8',  name: '1170 Media Relations',          clientId: 'c4' },
    ],
    tasks: [
      { id: 't1', name: 'Meetings & Initiatives',         clientId: 'c1' },
      { id: 't2', name: 'Earned Media',                   clientId: 'c1' },
      { id: 't3', name: 'Media Relations',                clientId: 'c1' },
      { id: 't4', name: 'AcctMgmt - Account Management',  clientId: 'c2' },
      { id: 't5', name: 'Earned Media',                   clientId: 'c3' },
      { id: 't6', name: 'Earned Media',                   clientId: 'c4' },
    ],
  }
}
