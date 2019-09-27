import axios from 'axios';
import { RequestApi, WorkflowApi } from '@redhat-cloud-services/approval-client';
import { DefaultApi as SourcesDefaultApi } from '@redhat-cloud-services/sources-client';
import { DefaultApi as TopologicalDefaultApi } from '@redhat-cloud-services/topological-inventory-client';
import { PortfolioApi, PortfolioItemApi, OrderApi, OrderItemApi, IconApi } from '@redhat-cloud-services/catalog-client';

import { SOURCES_API_BASE, TOPOLOGICAL_INVENTORY_API_BASE, CATALOG_API_BASE, APPROVAL_API_BASE, RBAC_API_BASE } from '../../utilities/constants';
import { AccessApi, PrincipalApi, GroupApi } from '@redhat-cloud-services/rbac-client';

const axiosInstance = axios.create();

let admin_hash = { 'x-rh-auth-identity': btoa(JSON.stringify({ identity: { is_org_admin: true }})) };
const user_hash = { 'x-rh-identity': btoa(JSON.stringify({ identity: { account_number: '1111111', type: 'User', user: {
  username: 'lgalis@redhat.com',
  email: 'lgalis@redhat.com',
  first_name: 'Laura',
  last_name: 'Galis',
  is_active: true,
  is_org_admin: true,
  is_internal: false,
  locale: 'en_US' },
internal: {
  org_id: '1460290',
  auth_type: 'basic-auth',
  auth_time: 6300 }
}
})) };

Object.assign(axiosInstance.defaults.headers, user_hash);

const paramSerializer = config => {
  config.url = config.url.replace(/(?==)*%+/g, value => value.replace(/%/g, '%25%0A'));
  return config;
};

const resolveInterceptor = response => response.data || response;
const errorInterceptor = (error = {}) => {
  throw { ...error.response };
};

// check identity before each request. If the token is expired it will log out user
axiosInstance.interceptors.request.use(async config => {
  await window.insights.chrome.auth.getUser();
  return config;
});
axiosInstance.interceptors.request.use(paramSerializer);
axiosInstance.interceptors.response.use(resolveInterceptor);
axiosInstance.interceptors.response.use(null, errorInterceptor);

const orderApi = new OrderApi(undefined, CATALOG_API_BASE, axiosInstance);
const orderItemApi = new OrderItemApi(undefined, CATALOG_API_BASE, axiosInstance);
const portfolioApi = new PortfolioApi(undefined, CATALOG_API_BASE, axiosInstance);
const portfolioItemApi = new PortfolioItemApi(undefined, CATALOG_API_BASE, axiosInstance);
const iconApi = new IconApi(undefined, CATALOG_API_BASE, axiosInstance);
const requestsApi = new RequestApi(undefined, APPROVAL_API_BASE, axiosInstance);
const workflowApi = new WorkflowApi(undefined, APPROVAL_API_BASE, axiosInstance);
const sourcesApi = new SourcesDefaultApi(undefined, SOURCES_API_BASE, axiosInstance);
const topologicalInventoryApi = new TopologicalDefaultApi(undefined, TOPOLOGICAL_INVENTORY_API_BASE, axiosInstance);

export function getSourcesApi() {
  return sourcesApi;
}

export function getTopologocalInventoryApi() {
  return topologicalInventoryApi;
}

export function getPortfolioApi() {
  return portfolioApi;
}

export function getPortfolioItemApi() {
  return portfolioItemApi;
}

export function getIconApi() {
  return iconApi;
}

export function getOrderApi() {
  return orderApi;
}

export function getOrderItemApi() {
  return orderItemApi;
}

export function getRequestsApi() {
  return requestsApi;
}

let rbacAccessApi = new AccessApi(undefined, RBAC_API_BASE, axiosInstance);
let rbacPrincipalApi = new PrincipalApi(undefined, RBAC_API_BASE, axiosInstance);
let rbacGroupApi = new GroupApi(undefined, RBAC_API_BASE, axiosInstance);

export function getRbacAccessApi() {
  return rbacAccessApi;
}

export function getRbacPrincipalApi() {
  return rbacPrincipalApi;
}

export function getRbacGroupApi() {
  return rbacGroupApi;
}

export function getWorkflowApi() {
  return workflowApi;
}

export function getAxiosInstance() {
  return axiosInstance;
}

const grapqlInstance = axios.create();
grapqlInstance.interceptors.request.use(async config => {
  await window.insights.chrome.auth.getUser();
  return config;
});
/**
 * Graphql does not return error response when the qery fails.
 * Instead it returns 200 response with error object.
 * We catch it and throw it to trigger notification middleware
 */
grapqlInstance.interceptors.response.use(({ data }) => {
  if (data.errors) {
    throw {
      message: data.errors[0].errorType,
      data: data.errors[0].message
    };
  }

  return data;
});

export function getGraphqlInstance() {
  return grapqlInstance;
}
