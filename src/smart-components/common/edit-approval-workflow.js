import React, { useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Modal, ActionGroup } from '@patternfly/react-core';
import FormRenderer from '../common/form-renderer';
import editApprovalWorkflowSchema from '../../forms/edit-workflow_form.schema';
import {
  listWorkflowsForObject,
  linkWorkflow,
  unlinkWorkflow
} from '../../redux/actions/approval-actions';
import { APP_NAME } from '../../utilities/constants';
import { loadWorkflowOptions } from '../../helpers/approval/approval-helper';
import { WorkflowLoader } from '../../presentational-components/shared/loader-placeholders';
import ApprovalList from './approval-list';

const initialState = {
  isFetching: true
};

const approvalState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    case 'setInitialValues':
      return {
        ...state,
        isFetching: false,
        currentWorkflows: action.payload.data
      };
    default:
      return state;
  }
};

const EditApprovalWorkflow = ({
  closeUrl,
  objectType,
  objectId,
  objectName = () => objectType
}) => {
  const [{ isFetching }, stateDispatch] = useReducer(
    approvalState,
    initialState
  );
  const { data, meta } = useSelector(
    ({ approvalReducer: { resolvedWorkflows } }) => resolvedWorkflows
  );
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const pushParam = {
    pathname: closeUrl
  };

  const [currentWorkflows, setCurrentWorkflows] = useState();

  useEffect(() => {
    dispatch(
      listWorkflowsForObject(
        { objectType, appName: APP_NAME[objectType], objectId: id || objectId },
        meta
      )
    ).then((data) =>
      stateDispatch({ type: 'setInitialValues', payload: data })
    );
  }, []);

  const onSubmit = () => {
    history.push(pushParam);
    const toUnlinkWorkflows = currentWorkflows - data;
    const toLinkWorkflows = data - currentWorkflows;

    if (toUnlinkWorkflows) {
      toUnlinkWorkflows.map((wf) =>
        dispatch(
          unlinkWorkflow(wf.id, wf.name, {
            object_type: objectType,
            app_name: APP_NAME[objectType],
            object_id: id || objectId
          })
        )
      );
    }

    if (toLinkWorkflows) {
      toLinkWorkflows.map((wf) =>
        dispatch(
          linkWorkflow(wf.workflow, {
            object_type: objectType,
            app_name: APP_NAME[objectType],
            object_id: id || objectId
          })
        )
      );
    }
  };

  const onCancel = () => {
    history.push(pushParam);
  };

  const onAddWorkflow = (values) => {
    return setCurrentWorkflows([...currentWorkflows, values.workflow]);
  };

  const removeWorkflow = (values) => {
    return setCurrentWorkflows([...currentWorkflows, values.workflow]);
  };

  return (
    <Modal
      title={`Set approval workflow for ${objectName(id)}`}
      isOpen
      onClose={() => history.push(pushParam)}
      isLarge
    >
      {!isFetching ? (
        <FormRenderer
          onSubmit={onAddWorkflow}
          schema={editApprovalWorkflowSchema(loadWorkflowOptions)}
          buttonsLabels={{ submitLabel: 'Add' }}
        />
      ) : (
        <WorkflowLoader />
      )}
      <ApprovalList
        workflows={data}
        isLoading={isFetching}
        removeWorkflow={removeWorkflow}
      />
      <ActionGroup>
        <Button type="button" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit()}
          isDisabled={false}
          type="button"
          className="pf-u-mr-md"
          id="edit-approval-submit"
        >
          Submit
        </Button>
      </ActionGroup>
    </Modal>
  );
};

EditApprovalWorkflow.propTypes = {
  closeUrl: PropTypes.string.isRequired,
  objectType: PropTypes.string.isRequired,
  objectName: PropTypes.func,
  objectId: PropTypes.string
};

export default EditApprovalWorkflow;
