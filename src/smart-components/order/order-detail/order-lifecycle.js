import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import useQuery from '../../../utilities/use-query';

const OrderLifecycle = () => {
  const [, search] = useQuery([]);
  const { url } = useRouteMatch('/order');
  const orderDetailData = useSelector(
    ({ orderReducer: { orderDetail } }) => orderDetail || {}
  );
  const { order, orderItem } = orderDetailData;
  if (order.state !== 'Completed') {
    return (
      <Redirect
        to={{
          pathname: url,
          search
        }}
      />
    );
  }

  return (
    <div>
      <a
        href={orderItem.external_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Manage product
      </a>
    </div>
  );
};

export default OrderLifecycle;
