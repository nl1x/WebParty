interface Role {
    name: string;
    displayName: string;
    weight: number;
}

const ROLES: Role[] = [
    {
        name: 'admin',
        displayName: 'Administrateur',
        weight: 999
    },
    {
        name: 'orga',
        displayName: 'Organisateur',
        weight: 100
    },
    {
        name: 'user',
        displayName: 'Utilisateur',
        weight: 0
    },
]

export default ROLES;