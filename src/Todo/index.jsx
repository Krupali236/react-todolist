import { useState, useEffect } from 'react'
import './styles.css'
const TodoList = () => {
    const [inputValue, setInputValue] = useState({}); // State for input
    const [todoArray, setTodoArray] = useState([]); // State for the list of todos
    const [checked, setChecked] = useState({}); // State for the checkbox    
    const [edited, setEdited] = useState(false); //State for the edit
    const [editIndex, setEditIndex] = useState(); //State for the edit
    const [isDeleteAll, setIsDeleteAll] = useState(false); //State for delete all

    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem('TodoData')) || [];
        setTodoArray(storedTodos);
    }, []);

    const renderArray = () => {
        localStorage.setItem('TodoData', JSON.stringify(todoArray))
    }
    const handleOnchange = (e) => {
        const { name, value } = e.target;
        setInputValue((inputValue) => ({
            ...inputValue,
            [name]: value,
        }))
    }

    const handleValidation = (values) => {
        if (!values?.input) {
            alert("please input value");
            return false
        }
        return true
    }

    const handleOnClick = () => {
        if (edited) {
            const EditedValue = inputValue.input;
            const updateData = todoArray.map((v, idx) => {
                if (editIndex === idx) {
                    todoArray[idx] = EditedValue
                    return EditedValue
                } else {
                    return v
                }
            })
            renderArray();
            setTodoArray(updateData)
            setInputValue({})
            setEdited(false)
        }
        else {
            const isValid = handleValidation(inputValue)
            const storeValue = inputValue.input;
            // setTodoArray([...todoArray, { input: storeValue, isCompleted: false }]);
            if (isValid) {
                todoArray.push(storeValue);
                renderArray();
                setInputValue({})
            }
        }
    }

    const isChecked = (index) => {
        setChecked((prev) => {
            const updateCheck = {
                ...prev,
                [index]: !prev[index],
            }
            return updateCheck
        });
    };

    const handleDelete = (index) => {
        const updateArray = todoArray.splice(index, 1)
        renderArray();
        setInputValue(updateArray);
    }

    useEffect(() => {
        if (isDeleteAll) {
            renderArray();
            setIsDeleteAll(false)
        }
    }, [isDeleteAll,renderArray])

    const HandleDeleteAll = (e) => {
        e.preventDefault();
        setTodoArray([]);
        setInputValue({});
        setIsDeleteAll(true)
    }

    const handleEdit = (index) => {
        setEditIndex(index)
        setInputValue({ ...inputValue, input: todoArray[index] })
        setEdited(true)
    }
    return (
        <>
            <div className="lg:container">
                <h1 className='text-3xl'>TodoInput</h1>
                <div className='my-5 border-2 rounded-md'>
                    <div className='my-4'>
                        <input type="text" name='input' value={inputValue?.input || ""} placeholder='New Todo' className='p-4 w-96 rounded-md border-[1px] border-solid border-gray-300' onChange={(e) => handleOnchange(e)} />
                    </div>
                    <div className='my-4'>
                        <button type='submit' className='p-3 rounded-md w-96 mx-5 bg-blue-800 text-white font-semibold text-lg' onClick={
                            handleOnClick}>Add</button>
                    </div>
                </div>
                <h1 className=' text-3xl'>TodoList</h1>
                <div className='my-4 flex justify-around'>
                    <button className='bg-blue-800 w-32 text-white rounded-md mx-4'>All</button>
                    <button className='bg-blue-800 w-32 text-white rounded-md mx-4'>Done</button>
                    <button className='bg-blue-800 w-32 text-white rounded-md mx-4'>Todo</button>
                </div>
                <div className='ListItem'>
                    {todoArray.map((val, ind) => (
                        <div key={ind} className='w-full border-2 bg-transparent  my-4 p-3 rounded-md text-start font-semibold font-sans flex justify-between items-center'>{val}
                            <span className='flex flex-row items-center'>
                                {checked[ind] ? <i className="fa-regular fa-square-check text-2xl mx-2 text-green-600 cursor-pointer" onClick={() => isChecked(ind)}></i> : <i className="fa-solid fa-square-check text-2xl mx-2 text-green-600 cursor-pointer" onClick={() => isChecked(ind)}></i>}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="orange" className="size-6 mx-1 cursor-pointer" onClick={() => { handleEdit(ind) }}>
                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                </svg>

                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#b91c1c" className="size-6 mx-1 cursor-pointer" onClick={() => handleDelete(ind)}>
                                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>
                    ))}
                </div>
                <div className='my-4 flex justify-around'>
                    <button className='bg-red-700 text-white p-3 w-56 rounded-md'>Delete Done Task</button>
                    <button className='bg-red-700 text-white p-3 w-56 rounded-md' onClick={(e) => HandleDeleteAll(e)}>Delete All Task</button>
                </div>
            </div>
        </>
    )
}
export default TodoList