
enum ROLE {
    ADMIN='admin',
    ORGANISER='orga',
    USER='user',
}

const Roles = {
    [ROLE.ADMIN]: 999,
    [ROLE.ORGANISER]: 100,
    [ROLE.USER]: 0
}

export { ROLE, Roles };
