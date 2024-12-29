
export interface RoleProps {
    name: string;
    displayName: string;
    weight: number;
}

export interface ActionProps {
    id: number;
    proofPicture: string;
    status: string;
    action: {
        description: string;
        difficulty: number;
        requireProof: boolean;
    };
}

export interface MinimalUserProps {
    username: string;
    avatarUrl: string;
    role: RoleProps;
    score: number;
}

interface UserProps extends MinimalUserProps {
    id: number;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface PendingActionProps extends ActionProps {
    user: UserProps;
}

export interface UserProfileProps {
    me: {
        id: number;
        username: string;
        avatarUrl: string;
        createdAt: string;
        updatedAt: string;
        role: RoleProps;
        history: ActionProps[];
        action?: ActionProps;
    }
}
