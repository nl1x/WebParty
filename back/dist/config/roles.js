"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ROLES = [
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
];
exports.default = ROLES;
