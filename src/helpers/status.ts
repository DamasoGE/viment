export const getStatusColor = (status: string) => {
switch (status) {
    case 'pending':
    return 'gold';
    case 'completed':
    return 'green';
    case 'canceled':
    return 'lightgrey';
    default:
    return 'default';
}
};

export const statusTextMap: Record<string, string> = {
pending: 'Pendiente',
completed: 'Completada',
canceled: 'Cancelada',
};