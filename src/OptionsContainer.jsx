export const OptionsContainer = ({ currentOptions, handleOptionClick, closedRoutes }) => {
    return (
        <div id='options-container' className="flex-column">
            {currentOptions.options.map((x, i) => {
                return (
                    <p key={i + new Date().getTime()} onClick={() => handleOptionClick(i)} className='options-text'>
                        {x?.['option-tag']?.every(tag => closedRoutes[tag]) ?
                            x['locked-text']
                            :
                            x.text
                        }
                    </p>
                )
            })}
        </div>
    )
}