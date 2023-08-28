import './index.css'
import { Link } from 'react-router-dom'
import Detail from './Detail';
import detailData from './Detail/data/detail'
import Feature from './Feature';
import featureData from './Feature/data/feature'
import Logo from './Images/Novel-Nexus-Logo.png'

function LandingPage()
{
    return (
        <div className='landing-page'>
            <Link to='/'>
                <img className='landing-page-logo' src={Logo} alt='logo'/>
            </Link>
            <Link to='/books'>
                <button className='landing-page-browse-book landing-page-intro-btn landing-page-logo'>
                    Browse book
                </button>
            </Link>
            <div className="landing-page-intro">
                <div className='landing-page-intro-title'>
                    <h1 style={{fontSize: 80}}>Novel Nexus</h1>
                    <p style={{fontSize: 30}}>Your unique literary journey starts here.</p>
                    <Link to='/accounts/signup'>
                        <button className='landing-page-intro-btn'>Sign up</button>
                    </Link>
                    <Link to='/accounts/login'>
                        <button className='landing-page-intro-btn sign-in'>Sign in</button>
                    </Link>
                </div>
            </div>
            <div className='landing-page-break-line'></div>
            <div className='landing-page-intro-description'>
                    We'll help you <b>track your reading</b> and <b>discover your next book</b> from new/upcoming authors.
            </div>
            <div className='landing-page-break-line'></div>
            <div className='landing-page-detail'>
                {
                    detailData.map((eachData) => {
                        return (
                            <Detail isImageFirst={eachData.isImageFirst} icon={eachData.icon } title={eachData.title}
                            description={eachData.description} detailImg={eachData.img} />
                        )
                    })
                }
            </div>
            <div className='landing-page-break-line'></div>
            <div className='landing-page-feature'>
                <div className='landing-page-feature-title'>
                    <h1> A digital reading alternative that supports authors with your support</h1>
                    <h3>Novel Nexus is your one-stop destination for all your reading needs.</h3>
                </div>
                <div className='landing-page-feature-detail'>
                    {
                        featureData.map((eachData) => {
                            return (
                                <Feature icon={eachData.icon} feature={eachData.feature} details={eachData.details} />
                            )
                        })
                    }
                </div>
            </div>
            <div className='landing-page-break-line'></div>

        </div>
    );
}

export default LandingPage
