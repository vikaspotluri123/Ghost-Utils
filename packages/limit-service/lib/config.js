module.exports = {
    members: {
        currentCountQuery: async (db) => {
            let result = await db.knex('members').count('id', {as: 'count'}).first();
            return result.count;
        }
    },
    staff: {
        currentCountQuery: async (db) => {
            let result = await db.knex('users')
                .select('users.id')
                .leftJoin('roles_users', 'users.id', 'roles_users.user_id')
                .leftJoin('roles', 'roles_users.role_id', 'roles.id')
                .whereNot('roles.name', 'Contributor').andWhereNot('users.status', 'inactive').union([
                    db.knex('invites')
                        .select('invites.id')
                        .leftJoin('roles', 'invites.role_id', 'roles.id')
                        .whereNot('roles.name', 'Contributor')
                ]);

            return result.length;
        }
    },
    custom_integrations: {
        currentCountQuery: async (db) => {
            let result = await db.knex('integrations').count('id', {as: 'count'}).whereNotIn('type', ['internal', 'builtin']).first();
            return result.count;
        }
    },
    custom_themes: {}
};