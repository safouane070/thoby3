// Apart chunk: de animatie-engine laadt na de eerste render (LazyMotion). domAnimation is genoeg: de nav-pil schuift
// in CSS en de winkelwagen gebruikt geen layout-animaties meer, dus de zwaardere domMax (layout, drag) hoeft niet mee.
import { domAnimation } from "framer-motion";
export default domAnimation;
