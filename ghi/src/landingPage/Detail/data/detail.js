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
        title: "Follow your favorite authors",
        description: "So so doh dohfa mee sodoh, so so doh meefa mee sodoh, so so doh sodoh mee somee, so so doh sodoh mee dohsodohdoh",
        img: SmartRecommendations,
    },
    {
        id: 2,
        isImageFirst: false,
        icon: <UilCloudComputing/ >,
        title: "Get smart personalized recommendations",
        description: "So so doh dohfa mee sodoh, so so doh meefa mee sodoh, so so doh sodoh mee somee, so so doh sodoh mee dohsodohdoh",
        img: FavoriteAuthor,
    },
    {
        id: 3,
        isImageFirst: true,
        icon: <UilSync/ >,
        title: "Get updates when new chapters release",
        description: "So so doh dohfa mee sodoh, so so doh meefa mee sodoh, so so doh sodoh mee somee, so so doh sodoh mee dohsodohdoh",
        img: Updates,
    }
]

export default description
