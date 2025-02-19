const InputField = ({ id, placeholder, value, onChange }) => {
    return (
        <div>
            <input
                id={id}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-300 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder={placeholder}
                value={value}
                onChange={onChange} // Handles state updates
            />
        </div>
    );
};

export default InputField;
