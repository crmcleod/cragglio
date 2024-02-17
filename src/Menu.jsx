import buried from './buried.png'
export const Menu = () => {
    return(
        <div id='menu' className='w100 flex-column'>
            {
                window.location.href.split('story=').pop() === 'mine' ?
                <img src={buried} alt="pixel-fonts" border="0" /> :
                <img src="https://fontmeme.com/permalink/240111/f45262581f21279817d10f126ed68d31.png" alt="pixel-fonts" border="0"/>
                }
            <p>A Text Adventure</p>
        </div>
    )
}