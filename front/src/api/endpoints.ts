const Endpoints = {
    auth: {
        login: '/auth/login',
    },
    users: {
        me: '/users/me',
        all: '/users/',
        update: '/users/',
    },
    actions: {
        validate: '/actions/validate-current',
        pendingApproval: '/actions/pending-approval',
        approve: (id: number) => `/actions/${id}/approve-action`
    }
}

export default Endpoints;
