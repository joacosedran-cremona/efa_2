import DatosLaterales from '@/components/desmoldeoLayout/datosLaterales';
//import Productividad from '@/components/productividad/Productividad';
//import FiltroPeriodoGraficos from '@/components/filtroperiodo/FiltroPeriodoGraficos';
//import Layout from "@/components/desmoldeoLayout/Layout.";

function Desmoldeo() {
    return (
      <div className="flex flex-row">
        <DatosLaterales />
        {/*
            <div className="">
                <section id="section1" className="">
                    <Layout />
                </section>
        */}

        {/*
                <section id="section2" className="">
                <Productividad />
                </section>
        */}

        {/*
                <section id="section3" className="">
                    <FiltroPeriodoGraficos />
                </section>
            </div>
        */}
      </div>
    );
}

export default Desmoldeo;
