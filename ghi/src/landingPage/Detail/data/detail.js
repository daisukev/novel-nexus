import { UilPen } from '@iconscout/react-unicons'
import { UilCloudComputing } from '@iconscout/react-unicons'
import { UilSync } from '@iconscout/react-unicons'
import SmartRecommendations from '../../Images/SmartRecommendations.png'
import FavoriteAuthor from '../../Images/FavoriteAuthor.png'
import Updates from '../../Images/Updates.png'

let description = [
    {
        id: 1,
        isImageFirst: true,
        icon: <UilPen/ >,
        title: "A Spectrum of Stories",
        description: "Whether it's a gripping thriller or a tender love story, our vast collection caters to every reader's penchant, ensuring a tale for every taste.",
        img: SmartRecommendations,
    },
    {
        id: 2,
        isImageFirst: false,
        icon: <UilCloudComputing/ >,
        title: "Personalized Writing Experience",
        description: "Unleash your inner author and bring to life the stories you've always dreamt of. With our intuitive platform, not only can you pen down your tales, but you also have the opportunity to publish them for a community of eager readers to enjoy.",
        img: FavoriteAuthor,
    },
    {
        id: 3,
        isImageFirst: true,
        icon: <UilSync/ >,
        title: "Engage with New and Beloved Authors",
        description: "Dive deeper into the world of storytelling by connecting with new and acclaimed authors. Stay updated with their latest creations and gain insights to fuel your own reading or writing passions.",
        img: Updates,
    }
]

export default description
