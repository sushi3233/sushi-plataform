import { Prisma } from '@prisma/client';

export function getPrismaErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Prisma.PrismaClientInitializationError) {
        return 'Banco de dados indisponível. Verifique DATABASE_URL e se o PostgreSQL está rodando.';
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P1000') {
            return 'Falha de autenticação no banco. Verifique usuário e senha da DATABASE_URL.';
        }
        if (error.code === 'P1001') {
            return 'Não foi possível conectar ao banco. Verifique host/porta da DATABASE_URL.';
        }
        if (error.code === 'P2021') {
            return 'Schema não aplicado no banco. Execute prisma db push antes de testar.';
        }
    }

    if (error instanceof Error) {

        return error.message.split('\n')[0] || fallback;
    }

    return fallback;
}
