import { notification } from 'antd';
import { formatMessage } from 'umi/locale';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      if (!(err.message === 'TOKEN_INVALID_NO_SHOW')) {
        notification.error({
          message: formatMessage({ id: 'REQUEST_ERROR' }),
          description: err.message,
        });
      }
    },
  },
};

export function patchRoutes(routes) {
  window.g_routes = routes;
}

export function render(oldRender) {
  oldRender();
}
