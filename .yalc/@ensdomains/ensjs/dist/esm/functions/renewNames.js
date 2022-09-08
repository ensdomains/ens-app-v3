export default async function ({ contracts }, nameOrNames, { duration, value, }) {
    const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
    const labels = names.map(name => {
        const label = name.split('.');
        if (label.length !== 2 || label[1] !== 'eth') {
            throw new Error('Currently only .eth TLD renewals are supported');
        }
        return label[0];
    });
    if (labels.length === 1) {
        const controller = await contracts.getEthRegistrarController();
        return controller.populateTransaction.renew(labels[0], duration, { value });
    }
    else {
        const bulkRenewal = await contracts.getBulkRenewal();
        return bulkRenewal.populateTransaction.renewAll(labels, duration, { value });
    }
}
