/// <reference path="../dts/globals.d.ts" />


import { icon, i18n } from './shared-vars';
import { Utils } from './utils';
import { Field } from './data';
import { listViews } from './shared-vars';
import { ReactElement, isValidElement } from 'react';
import { DataForm } from './data-form';
import { Spinner } from './spinner';
import { AdvButton, Placeholder } from './ui-elements';
import OrganicBox from './organic-box';
import { IActionsForCRUD, IOptionsForCRUD, ISingleViewParams } from '@organic-ui';
import { createClientForREST } from './rest-api';

import { Icon, Paper, Button } from './inspired-components';
import { DeveloperBar } from './developer-features';
interface SingleViewBoxState<T> { formData: T; validated: boolean; }

export class SingleViewBox<T> extends OrganicBox<
    IActionsForCRUD<T>, IOptionsForCRUD, ISingleViewParams, SingleViewBoxState<T>> {
    undefinedFields: Object;
    objectCreation: number;
    static fetchFail: Function;
    static monitorFunc: Function;
    static getMonitorFunc(): Function {
        const { monitorFunc } = SingleViewBox;
        return !!DeveloperBar.developerFriendlyEnabled && monitorFunc;
    }

    constructor(p) {
        super(p);
        this.handleFieldRead = this.handleFieldRead.bind(this);
        this.handleFieldWrite = this.handleFieldWrite.bind(this);
        this.navigateToBack = this.navigateToBack.bind(this);
        this.navigateToNewItem = this.navigateToNewItem.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.undefinedFields = {};
        this.objectCreation = +new Date();
    }
    navigateToBack(): any {
        const id = this.getId(this.state.formData);
        const url = [this.props.options.routeForListView, id && ('selectedId=' + id)].filter(x => !!x).join('?');
        Utils.navigate(url);
    }
    refs: {
        dataForm: DataForm;
        primaryButton: AdvButton;
        secondaryButton: AdvButton;
    }
    mapFormData(formData) {
        return this.actions.mapFormData ? this.actions.mapFormData(formData) : formData;
    }
    componentWillMount() {
        const { actions, params } = this.props;
        const monitorFunc = SingleViewBox.getMonitorFunc();
        this.state.formData = params.id > 0
            ? actions.read(params.id)
                .then(data => monitorFunc instanceof Function ? monitorFunc('readData', data) : data)
                .then(formData => (formData = this.mapFormData(formData), this.repatch({ formData }), formData)
                    , error => {
                        this.devElement = this.makeDevElementForDiag(error);
                        this.repatch({})
                    }
                ).then(formData => this.actions.mapFormData ? monitorFunc('mapFormData', formData) : formData)

            : this.mapFormData({});
    }
    getId(row) {
        if (this.actions.getId instanceof Function)
            return this.actions.getId(row);
        return Utils.defaultGetId(row);
    }
    getFormData(): T {
        const { formData } = this.state;
        if (formData instanceof Promise) return null;
        return formData;
    }
    setFieldValue(fieldName, value) {
        const formData = this.getFormData();
        formData && (formData[fieldName] = value);
    }
    
    async handleSave(navigateToListView?) {
        const p = this.props, s = this.state;
        this.repatch({ validated: true });

        const { dataForm } = this.refs;
        console.assert(!!dataForm, 'dataForm is null @ handleSave');
        let formData = JSON.parse(JSON.stringify(s.formData));
        if (!!this.actions.beforeSave)
            console.assert(this.actions.beforeSave instanceof Function, 'this.actions.beforeSave is not function', this.actions.beforeSave);

        if (this.actions.beforeSave instanceof Function)
            formData = await Utils.toPromise(this.actions.beforeSave(formData));
        const [invalidItems] = await Promise.all([dataForm.revalidateAllFields(formData)]);
        if (invalidItems && invalidItems[0]) {
            dataForm.setFocusByAcccesor(invalidItems[0].accessor);
            return dataForm.getErrorCard();
        }
        let updateResult: Promise<any>;
        let { id } = p.params;
        if (id == 'new') id = 0;
        const monitorFunc = SingleViewBox.getMonitorFunc();
        const debugResult = await Utils.toPromise(!!monitorFunc && monitorFunc('beforeSave', formData));
        console.assert(debugResult === -1, 'debugResult>>>>', { debugResult });
        if (this.actions.create instanceof Function && this.actions.update instanceof Function)
            updateResult = id > 0 ? this.actions.update(id, formData) : this.actions.create(formData);
        else {
            return (<div className="error-callback" style={{ padding: '10px' }}><div className="title is-3 animated fadeIn">{i18n('error')}</div>
                <div className="animated fadeInDown">
                    {i18n('not impl update & create')}
                </div>
            </div>);
        }

        return updateResult
            .then(data => monitorFunc instanceof Function ? monitorFunc('afterSave', formData, id, this.actions) : data)
            .then(
                () => {
                    const { title, desc } = this.getSuccess();
                    if (navigateToListView)
                        setTimeout(this.navigateToBack, 10);
                    else
                        setTimeout(() => this.refs.primaryButton.closeCallOut(), 2800);
                    return !navigateToListView && <div className="single-view-callout" style={{ padding: '3px' }}>
                        <header className="columns">
                            <div className="column" style={{ maxWidth: "70px" }}>
                                <span className="animated tada">
                                    <Icon iconName="SkypeCircleCheck" className="ms-font-su" />
                                </span>
                            </div>
                            <div className="column" style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="title is-3">{title}</div>
                            </div>
                        </header>


                    </div>;
                }, error => (this.devElement = this.makeDevElementForDiag(error), this.repatch({})));




    }
    makeDevElementForDiag(error) {

        if (!SingleViewBox.fetchFail) return null;
        return SingleViewBox.fetchFail(Object.assign({}, createClientForREST['lastRequest'] || {}, {
            error, result: error,
            onProceed: () => (this.devElement = null, this.repatch({}))
        }))
    }
    navigateToNewItem() {

        Utils.navigate(this.props.options.routeForListView.replace(':id', 'new'))
    }
    getSuccess() {
        const { options } = this.props;
        const args = { s: i18n.get(options.singularName), p: i18n.get(options.pluralName) };
        const title = Utils.i18nFormat('success-title-save-fmt', args);
        const desc = Utils.i18nFormat('success-desc-save-fmt', args);
        return { title, desc };
    }
    getDevButton() {
        return Utils.renderDevButton("SingleView", this);
    }
    isFresh() {
        return (+new Date()) - this.objectCreation < 2500;
    }
    handleFieldWrite(accessor, value) {
        this.state.formData[accessor] = value;
        this.actions.onFieldWrite instanceof Function &&
            this.actions.onFieldWrite(accessor, value, this.state.formData);
    }
    handleFieldRead(accessor) {
        const val = this.state.formData[accessor];
        if (val === undefined && accessor) this.undefinedFields[accessor] = 1;
        if (this.isFresh() && val && accessor) delete this.undefinedFields[accessor];
        return val;

    }
    renderContent(p = this.props) {

        const { options } = this.props;
        const s = this.state;
        if (s.formData instanceof Promise) return <Spinner />;

        s.formData = s.formData || {} as any;// this.actions.read(this.props.id).then(formData => this.repatch({ formData } as any)) as any;
 
        return <section className="organic-box single-view developer-features" ref="root">
            <h1 className="title is-3 columns" style={{ margin: '0' }}>
                <div className="column  " style={{ flex: '10' }}>
                    {Utils.i18nFormat(p.params.id > 0 ? 'edit-entity-fmt' : 'add-entity-fmt', { s: i18n.get(options.singularName) })}
                </div>
                <div className="column" style={{ minWidth: '140px', maxWidth: '140px', paddingLeft: '0', paddingRight: '0', direction: 'rtl' }}>
                    <Button variant="raised" fullWidth className="singleview-back-btn button-icon-ux" onClick={this.navigateToBack}   >
                        {i18n('back')}
                        <Icon iconName="Back" />
                    </Button >
                </div>
            </h1>
            <Paper className="main-content">
                <DataForm ref="dataForm" onFieldRead={this.handleFieldRead}
                    onFieldWrite={this.handleFieldWrite}
                    validate={s.validated}
                    onErrorCode={this.actions.validate}
                    data={s.formData}>
                    {this.props.children}
                </DataForm>
                <footer className="buttons  single-view-buttons">
                    <AdvButton onClick={this.handleSave} variant="raised" color="primary" ref="primaryButton" > {i18n('save')}</AdvButton>
                    <AdvButton onClick={() => this.handleSave(true)} variant="raised" color="secondary" ref="secondaryButton"   > {i18n('save-and-exit')}</AdvButton>
                </footer>
            </Paper>

        </section>
    }

} 