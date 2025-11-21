import { createContext } from "react";

const DropdownContext = createContext({
    open: false,
    setOpen: () => {}
})

export default DropdownContext