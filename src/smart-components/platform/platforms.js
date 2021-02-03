import React, { Fragment, useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Text } from '@patternfly/react-core';
import { SearchIcon, CogIcon } from '@patternfly/react-icons';

import { scrollToTop } from '../../helpers/shared/helpers';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import ContentGallery from '../content-gallery/content-gallery';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import PlatformCard from '../../presentational-components/platform/platform-card';
import { createPlatformsToolbarSchema } from '../../toolbar/schemas/platforms-toolbar.schema';
import ContentGalleryEmptyState from '../../presentational-components/shared/content-gallery-empty-state';
import UserContext from '../../user-context';
import platformsMessages from '../../messages/platforms.messages';
import useFormatMessage from '../../utilities/use-format-message';
import filteringMessages from '../../messages/filtering.messages';

const Platforms = () => {
  const formatMessage = useFormatMessage();
  const [filterValue, setFilterValue] = useState('');
  const { platforms, isLoading } = useSelector(
    ({ platformReducer: { platforms, isPlatformDataLoading } }) => ({
      platforms,
      isLoading: isPlatformDataLoading
    })
  );
  const dispatch = useDispatch();
  const {
    userIdentity: {
      identity: {
        user: { is_org_admin }
      }
    }
  } = useContext(UserContext);

  useEffect(() => {
    dispatch(fetchPlatforms());
    scrollToTop();
    insights.chrome.appNavClick({ id: 'platforms', secondaryNav: true });
  }, []);

  const filteredItems = {
    items: platforms
      .filter(({ name }) =>
        name.toLowerCase().includes(filterValue.toLowerCase())
      )
      .map((item) => (
        <PlatformCard ouiaId={`platform-${item.id}`} key={item.id} {...item} />
      )),
    isLoading: isLoading && platforms.length === 0
  };

  const NoDataAction = () =>
    is_org_admin ? (
      <Button
        component="a"
        href={`${document.baseURI}settings/sources`}
        id="add-source"
      >
        {formatMessage(platformsMessages.connectSource)}
      </Button>
    ) : (
      <Text>{formatMessage(platformsMessages.contactAdmin)}</Text>
    );

  const FilterAction = () => (
    <Button
      ouiaId={'clear-filter'}
      variant="link"
      onClick={() => setFilterValue('')}
    >
      {formatMessage(filteringMessages.clearFilters)}
    </Button>
  );

  const emptyStateProps = {
    PrimaryAction:
      filterValue && filterValue !== '' ? FilterAction : NoDataAction,
    title:
      filterValue && filterValue !== ''
        ? formatMessage(filteringMessages.noResults)
        : formatMessage(platformsMessages.noPlatforms),
    description:
      filterValue && filterValue !== ''
        ? formatMessage(filteringMessages.noResultsDescription)
        : formatMessage(platformsMessages.platformsNoDataDescription),
    Icon: filterValue && filterValue !== '' ? SearchIcon : CogIcon
  };

  return (
    <Fragment>
      <ToolbarRenderer
        schema={createPlatformsToolbarSchema({
          onFilterChange: (value) => setFilterValue(value),
          searchValue: filterValue,
          title: formatMessage(platformsMessages.title)
        })}
      />
      <ContentGallery
        {...filteredItems}
        renderEmptyState={() => {
          return <ContentGalleryEmptyState {...emptyStateProps} />;
        }}
      />
    </Fragment>
  );
};

export default Platforms;
