/// <reference path="../../organicUI.d.ts" />
/// <reference path="entities.d.ts" />
/// <reference path="api.d.ts" />

namespace LicApp.Frontend.Role {
    const { Field, ObjectField, SingleViewBox, ListViewBox } = OrganicUI;
    const { routeTable, DataList, GridColumn, DataForm, DataPanel, DataListPanel } = OrganicUI;
    const { DetailsList, SelectionMode, TextField } = FabricUI;

    const { i18n } = OrganicUI;

    //OrganicUI.routeTable.set('/view/customer/:id', CustomerView, { mode: 'single' });
    const api = OrganicUI.remoteApi as RoleAPI;
    const actions: IActionsForCRUD<RoleDTO> = {
        handleCreate: dto => api.createRole(dto),
        handleRead: id => api.findRoleById(id), handleLoadData: params => api.readRoleList(params),
        handleUpdate: (id, dto) => api.updateRoleById(id, dto),
        handleDelete: id => api.deleteRoleById(id)
    };
    const crudOptions: ICRUDOptions = {
        routeForSingleView: '/view/admin/role/:id',
        routeForListView: '/view/admin/roles',
        pluralName: 'roles', singularName: 'role', iconCode: 'fa-key'
    };

    const singleView = dataProps =>
        (<SingleViewBox dataProps={dataProps} actions={actions} options={crudOptions}>

            <DataPanel header={i18n("primary-fields")} primary >
                <Field accessor="customerCode" required>
                    <TextField type="text" />
                </Field>
                <Field accessor="customerName" required >
                    <TextField type="text" />
                </Field>
                <Field accessor="phone" required>
                    <TextField type="text" />
                </Field>
                <Field accessor="address" required>
                    <TextField type="text" />
                </Field>
            </DataPanel>
            <DataPanel header="payment-information">
                <Field accessor="paymentDate"    >
                    <TextField type="text" />
                </Field>
                <Field accessor="paymentStatus"    >
                    <TextField type="text" />
                </Field>
            </DataPanel>

            <DataPanel header="payment-information">
                <Field accessor="paymentDate"    >
                    <TextField type="text" />
                </Field>
                <Field accessor="paymentStatus"    >
                    <TextField type="text" />
                </Field>
            </DataPanel>
        </SingleViewBox>);
    routeTable.set('/view/admin/role/:id', singleView);

    const listView = () => (
        <ListViewBox actions={actions} options={crudOptions}>
            <DataList>
                <GridColumn accessor="deviceName" />
                <GridColumn accessor="customerName" />
            </DataList>
        </ListViewBox>
    )
    routeTable.set('/view/admin/roles', listView);

}