import './index.css'

function Feature(props) {
    return (
        <div className='feature'>
            <div className='feature-icon'>
                {props.icon}
            </div>
            <b>{props.feature}</b>
            <h4>{props.details}</h4>
        </div>
    )
}

export default Feature
