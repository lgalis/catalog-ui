import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, useLocation } from 'react-router-dom';

const createSearchQuery = (search, searchParams, preserveSearch) => {
  const paramsQuery = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return preserveSearch
    ? `${search}${paramsQuery.length > 0 ? `&${paramsQuery}` : ''}`
    : paramsQuery.length > 0
    ? `?${paramsQuery}`
    : '';
};

const CatalogLink = ({
  pathname,
  searchParams,
  nav,
  preserveSearch,
  ...props
}) => {
  const { search } = useLocation();
  const Component = nav ? NavLink : Link;
  const to = {
    pathname,
    search: createSearchQuery(search, searchParams, preserveSearch)
  };
  return <Component to={to} {...props} />;
};

CatalogLink.propTypes = {
  pathname: PropTypes.string.isRequired,
  searchParams: PropTypes.shape({
    [PropTypes.string]: PropTypes.string
  }),
  nav: PropTypes.bool,
  preserveSearch: PropTypes.bool
};

CatalogLink.defaultProps = {
  nav: false,
  preserveSearch: false,
  searchParams: {}
};

export default CatalogLink;
