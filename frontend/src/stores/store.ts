import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';

import usersSlice from './users/usersSlice';
import employeesSlice from './employees/employeesSlice';
import inventoriesSlice from './inventories/inventoriesSlice';
import machinerySlice from './machinery/machinerySlice';
import quality_checksSlice from './quality_checks/quality_checksSlice';
import raw_materialsSlice from './raw_materials/raw_materialsSlice';
import suppliersSlice from './suppliers/suppliersSlice';
import work_ordersSlice from './work_orders/work_ordersSlice';
import rolesSlice from './roles/rolesSlice';
import permissionsSlice from './permissions/permissionsSlice';

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,

    users: usersSlice,
    employees: employeesSlice,
    inventories: inventoriesSlice,
    machinery: machinerySlice,
    quality_checks: quality_checksSlice,
    raw_materials: raw_materialsSlice,
    suppliers: suppliersSlice,
    work_orders: work_ordersSlice,
    roles: rolesSlice,
    permissions: permissionsSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
