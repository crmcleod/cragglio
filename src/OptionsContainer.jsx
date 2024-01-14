export const OptionsContainer = ({ currentOptions, handleOptionClick }) => {
    return (
        <div id='options-container' className="flex-column">
            {currentOptions.options.map((x, i) => {
                return (
                    <p key={i + new Date().getTime()} onClick={() => handleOptionClick(i)} className='options-text'>
                        {x.text}
                    </p>
                )
            })}
        </div>
    )
}