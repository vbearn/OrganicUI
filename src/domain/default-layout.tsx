
/// <reference path="../organicUI.d.ts" />

const { Fabric } = OrganicUI.FabricUI;
const { menuBar, templates, Component, icon, route, Utils } = OrganicUI;

const { View } = OrganicUI;


function GeneralHeader() {
    return <div className="columns" style={{ width: '100%' }}>
        <div className="column is-1">
            lin.project
    </div>
        <div className="column  is-9">
            <OrganicUI.FabricUI.SearchBox />
        </div>
        <div className="column is-2">
            {icon('fav-')}
        </div>
    </div>;
}
const root = document.querySelector('#root');
class BaseView extends Component {

    render() {
       
        //    const dialogFunc = OrganicUI.dialogArray[OrganicUI.dialogArray.length - 1];
        const heightForContent = window.innerHeight - 100;
        return ((<Fabric className="master-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

            <header className="hero is-light cover-section" style={{ height: '40px' }}>
                <div className="hero-head">
                    <div className="container " style={{ display: "flex" }}>

                        <GeneralHeader />

                    </div>
                </div>
            </header>
            <section className="view container main-container" dir='rtl' style={{ textAlign: 'right', flex: '1' }} >


                <div className="extra-section">
                </div>

                <section style={{ padding: '5px', maxHeight: heightForContent + 'px', minHeight: heightForContent + 'px', overflow: 'hidden' }}>
                {this.props.children}
                </section>
                <div className="container" style={{ visibility: 'hidden', maxHeight: '2px' }}>
                    <div className=" " style={{ display: "flex", justifyContent: "space-around", alignItems: 'center' }}>
                        {Object.keys(OrganicUI.menuBar.data).map(key => (
                            <a href={OrganicUI.menuBar.data[key]}
                                className={` nav column ${location.pathname.startsWith(OrganicUI.menuBar.data[key]) ? 'is-active' : ''}`}
                            >
                                {Utils.showIconAndText(key)}
                            </a>))}
                    </div>
                </div>
            </section>
            <footer className="hero is-white footer-section" style={{ height: '60px', maxHeight: '60px', minHeight: '60px' }}>
                <div className="container">
                    <div className=" " style={{ display: "flex", justifyContent: "space-around" }}>
                        {Object.keys(OrganicUI.menuBar.data).map(key => (
                            <a href={(OrganicUI.menuBar(key)) as string}
                                className={` nav column ${location.pathname.startsWith((OrganicUI.menuBar(key) as string)) ? 'is-active' : ''}`}
                            >
                                {Utils.showIconAndText(key)}
                            </a>))}
                    </div>
                </div>


            </footer>

        </Fabric>))
    }
}
templates.set('default', BaseView as any);
