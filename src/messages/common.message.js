const { defineMessages } = require('react-intl');

const commonMessages = defineMessages({
  approvalTitle: {
    id: 'commonMessages.orderProcessesTitle',
    defaultMessage: 'Order processes'
  },
  unknown: {
    id: 'commonMessages.unknown',
    defaultMessage: 'Unknown'
  },
  actions: {
    id: 'commonMessages.actions',
    defaultMessage: 'Actions'
  },
  noRecords: {
    id: 'commonMessages.noRecords',
    defaultMessage: 'No records'
  },
  delete: {
    id: 'commonMessages.delete',
    defaultMessage: 'Delete'
  },
  deleting: {
    id: 'commonMessages.deleting',
    defaultMessage: 'Deleting'
  },
  cancel: {
    id: 'commonMessages.cancel',
    defaultMessage: 'Cancel'
  },
  save: {
    id: 'commonMessages.save',
    defaultMessage: 'Save'
  }
});

export default commonMessages;
