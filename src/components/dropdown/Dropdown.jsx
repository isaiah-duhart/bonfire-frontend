import { useState } from "react";
import DropdownContext from "../../context/DropdownContext";

import '../../styles/dropdown.css'

export default function Dropdown({children}){
    const [open, setOpen] = useState(false)

    return (
        <DropdownContext.Provider value={{open, setOpen}}>
            <div className="dropdown-container">{children}</div>
        </DropdownContext.Provider>
    )
}