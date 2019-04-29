import React from 'react';
import PropTypes from 'prop-types';
import {
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  Grid,
  GridItem,
  Level,
  LevelItem,
  Split,
  SplitItem,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';

import OrderSteps from './order-steps';
import OrderDetailTable from './order-detail-table';
import CardIcon from '../../presentational-components/shared/card-icon';
import { getOrderIcon, getOrderPortfolioName } from '../../helpers/shared/orders';
import { createOrderedLabel, createUpdatedLabel } from '../../helpers/shared/helpers';
import createOrderRow from './create-order-row';

const OrderItem = ({ item, isExpanded, handleDataItemToggle, portfolioItems }) => {
  const { finishedSteps, steps } = createOrderRow(item);

  return (
    <DataListItem aria-labelledby={ `${item.id}-expand` } isExpanded={ isExpanded } className="data-list-expand-fix">
      <DataListItemRow>
        <DataListToggle
          id={ item.id }
          aria-label={ `${item.id}-expand` }
          aria-labelledby={ `${item.id}-expand` }
          onClick={ () => handleDataItemToggle(item.id) }
          isExpanded={ isExpanded }
        />
        <DataListItemCells
          dataListCells={ [
            <DataListCell key="1" className="cell-grow">
              <Split gutter="sm">
                <SplitItem>
                  <CardIcon src={ getOrderIcon(item) } />
                </SplitItem>
                <SplitItem isMain>
                  <TextContent>
                    <Grid gutter="sm" style={ { gridGap: 8 } }>
                      <GridItem>
                        <Text
                          style={ { marginBottom: 0 } }
                          component={ TextVariants.h5 }
                        >
                          { `${getOrderPortfolioName(item, portfolioItems)} # ${item.id}` }
                        </Text>
                      </GridItem>
                      <GridItem>
                        <Level>
                          <LevelItem>
                            <Text
                              style={ { marginBottom: 0 } }
                              component={ TextVariants.small }
                            >
                              { `${createOrderedLabel(new Date(item.ordered_at))}` }
                            </Text>
                          </LevelItem>
                          <LevelItem>
                            <Text
                              style={ { marginBottom: 0 } }
                              component={ TextVariants.small }
                            >
                              Ordered by { item.owner }
                            </Text>
                          </LevelItem>
                          <LevelItem>
                            <Text
                              style={ { marginBottom: 0 } }
                              component={ TextVariants.small }
                            >
                              { `${createUpdatedLabel(item.orderItems)}` }
                            </Text>
                          </LevelItem>
                        </Level>
                      </GridItem>
                    </Grid>
                  </TextContent>
                </SplitItem>
              </Split>
            </DataListCell>,
            <DataListCell key="2" style={ { alignSelf: 'center' } }>
              <OrderSteps requests={ finishedSteps } />
            </DataListCell>
          ] }
        />
      </DataListItemRow>
      <DataListContent aria-label={ `${item.id}-content` } isHidden={ !isExpanded }>
        <OrderDetailTable requests={ steps } />
      </DataListContent>
    </DataListItem>
  );};

OrderItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    ordered_at: PropTypes.string.isRequired,
    orderItems: PropTypes.array.isRequired
  }).isRequired,
  isExpanded: PropTypes.bool,
  handleDataItemToggle: PropTypes.func.isRequired,
  portfolioItems: PropTypes.array.isRequired
};

OrderItem.defaultProps = {
  isExpanded: false
};

export default OrderItem;

