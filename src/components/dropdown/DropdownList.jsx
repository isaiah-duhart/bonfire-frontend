import { useContext } from "react";
import DropdownContext from "../../context/DropdownContext";

import '../../styles/dropdown.css'

export default function DropdownList({children, ...props}){
    const {setOpen} = useContext(DropdownContext)

    return (
        <ul className='dropdown-list' onClick={() => {setOpen(false)}}>
            {children}
        </ul>
    )
}