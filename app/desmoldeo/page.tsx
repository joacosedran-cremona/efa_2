import DatosLaterales from '@/components/desmoldeoLayout/datosLaterales';
//import Productividad from '@/components/productividad/Productividad';
//import FiltroPeriodoGraficos from '@/components/filtroperiodo/FiltroPeriodoGraficos';
//import Layout from "@/components/desmoldeoLayout/Layout.";

function Desmoldeo() {
    return (
      <div className="w-screen">
        <DatosLaterales />
        {/*
            <div className={style.secciones}>
                <section id="section1" className={style.seccion}>
                    <Layout />
                </section>
        */}

        {/*
                <section id="section2" className={style.seccion}>
                <Productividad />
                </section>
        */}

        {/*
                <section id="section3" className={style.seccion}>
                    <FiltroPeriodoGraficos />
                </section>
            </div>
        */}
      </div>
    );
}

export default Desmoldeo;
