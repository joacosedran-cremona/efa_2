import NavDatos from '@/components/desmoldeoLayout/NavDatos';
import Productividad from '@/components/productividad/Productividad';
import FiltroPeriodoGraficos from '@/components/filtroperiodo/FiltroPeriodoGraficos';
import Layout from "@/components/desmoldeoLayout/Layout.";

import style from "./Desmoldeo.module.css";

function Desmoldeo() {

    return (
        <div className={style.contenedor}>
            <NavDatos />
            <div className={style.secciones}>
                <section id="section1" className={style.seccion}>
                    <Layout />
                </section>

                <section id="section2" className={style.seccion}>
                    <Productividad />
                </section>

                <section id="section3" className={style.seccion}>
                    <FiltroPeriodoGraficos />
                </section>
            </div>
        </div>
        
    );
}

export default Desmoldeo;
