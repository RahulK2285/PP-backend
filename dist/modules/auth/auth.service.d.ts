export declare const authService: {
    register(data: {
        name: string;
        email: string;
        password: string;
        leetcodeUsername?: string;
    }): Promise<{
        token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            leetcodeUsername: string | undefined;
            role: "student" | "admin";
        };
    }>;
    login(email: string, password: string): Promise<{
        token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            leetcodeUsername: string | undefined;
            role: "student" | "admin";
        };
    }>;
    getProfile(userId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
        leetcodeUsername: string | undefined;
        role: "student" | "admin";
        createdAt: Date;
    }>;
    updateProfile(userId: string, data: {
        name?: string;
        leetcodeUsername?: string;
    }): Promise<{
        id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
        leetcodeUsername: string | undefined;
        role: "student" | "admin";
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map