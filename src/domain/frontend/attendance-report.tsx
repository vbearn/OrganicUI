/// <reference path="../../organicUI.d.ts" />
/// <reference path="entities.d.ts" />
/// <reference path="api.d.ts" />
 
namespace LicApp.Frontend.Customer {
    const { Field, ObjectField, SingleViewBox, ListViewBox ,ReportViewBox} = OrganicUI;
    const { routeTable, DataList,   DataForm, DataPanel, DataListPanel } = OrganicUI;
 
    const { i18n } = OrganicUI;

    //OrganicUI.routeTable.set('/view/customer/:id', CustomerView, { mode: 'single' });
    const api = OrganicUI.remoteApi as CustomerAPI;
    const actions: IActionsForCRUD<CustomerDTO> = {
        handleCreate: dto =>   api.createCustomer(dto),         
        handleRead: id => api.findCustomerById(id), handleReadList: params => api.readCustomerList(params),
        handleUpdate: (id, dto) => api.updateCustomerById(id, dto),
        handleDeleteList: id => api.deleteCustomerById(id)
    };
    const reportView = (params) =>
        (<ReportViewBox actions={null} options={null}  params={null} >

            
        </ReportViewBox>); 
    routeTable.set('/view/admin/reports/attendance', reportView);
} 