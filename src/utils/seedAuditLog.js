import AuditLog from '../models/AuditLog.js';

export const addSixDummyAuditLogs = async () => {
  try {
    const dummyLogs = [];

    for (let i = 1; i <= 6; i++) {
      dummyLogs.push({
        adminId: '000000000000000000000000', // dummy ObjectId string
        adminEmail: `admin${i}@example.com`,
        action: `dummyAction${i}`,
        target: `dummyTarget${i}`,
        details: { info: `Dummy audit log entry #${i}` },
      });
    }

    const result = await AuditLog.insertMany(dummyLogs);
    console.log('Inserted 6 dummy audit logs:', result);
  } catch (error) {
    console.error('Error inserting dummy audit logs:', error);
  }
};
