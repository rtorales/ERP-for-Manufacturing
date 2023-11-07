import React from 'react';
import BaseIcon from '../BaseIcon';
import { mdiEye, mdiTrashCan, mdiPencilOutline } from '@mdi/js';
import axios from 'axios';
import {
  GridActionsCellItem,
  GridRowParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import ImageField from '../ImageField';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import DataGridMultiSelect from '../DataGridMultiSelect';

import { hasPermission } from '../../helpers/userPermissions';

type Params = (id: string) => void;

export const loadColumns = async (
  onDelete: Params,
  onView: Params,
  onEdit: Params,

  user,
) => {
  async function callOptionsApi(entityName: string) {
    if (!hasPermission(user, 'READ_' + entityName.toUpperCase())) return [];

    const data = await axios(`/${entityName}/autocomplete?limit=100`);
    return data.data;
  }

  const hasUpdatePermission = hasPermission(user, 'UPDATE_INVENTORIES');

  return [
    {
      field: 'product_name',
      headerName: 'ProductName',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: hasUpdatePermission,
    },

    {
      field: 'available_quantity',
      headerName: 'AvailableQuantity',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: hasUpdatePermission,

      type: 'number',
    },

    {
      field: 'reserved_quantity',
      headerName: 'ReservedQuantity',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: hasUpdatePermission,

      type: 'number',
    },

    {
      field: 'returned_quantity',
      headerName: 'ReturnedQuantity',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: hasUpdatePermission,

      type: 'number',
    },

    {
      field: 'actions',
      type: 'actions',
      flex: 1,
      minWidth: 130,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',
      getActions: (params: GridRowParams) => {
        const actions = [
          <GridActionsCellItem
            key={1}
            icon={<BaseIcon path={mdiEye} size={24} />}
            onClick={() => onView(params?.row?.id)}
            label='View'
          />,
        ];

        if (hasUpdatePermission) {
          actions.push(
            <GridActionsCellItem
              key={2}
              icon={<BaseIcon path={mdiPencilOutline} size={24} />}
              onClick={() => onEdit(params?.row?.id)}
              label='Edit'
            />,
          );
        }

        if (hasUpdatePermission) {
          actions.push(
            <GridActionsCellItem
              key={3}
              icon={<BaseIcon path={mdiTrashCan} size={24} />}
              onClick={() => onDelete(params?.row?.id)}
              label='Delete'
            />,
          );
        }

        return actions;
      },
    },
  ];
};
