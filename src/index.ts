import { main } from "./main";
import { worker } from "./worker";

declare var global: Worker;

if (typeof document !== 'undefined') {
    main();
}
else {
    worker(global);
}
