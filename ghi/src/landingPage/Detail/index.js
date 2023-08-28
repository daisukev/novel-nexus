import './index.css'

function Detail(props) {
    return (
        <>
            {
                <div className='detail'>
                    {props.isImageFirst ? <img className='detail-image' src={ props.detailImg } alt='a person'/> : <></>}
                    <div className='detail-description'>
                        <div className='detail-icon'>
                            {props.icon}
                        </div>
                        <h2>{props.title}</h2>
                        <h5>{props.description}</h5>
                    </div>
                    {!props.isImageFirst ? <img className='detail-image' src={ props.detailImg } alt='a person'/> : <></>}
                </div>
            }
        </>

    )
}


export default Detail
