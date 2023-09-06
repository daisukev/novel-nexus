import React, { useState, useEffect, useRef} from "react"
import '../css/settings.css'



function AvatarUpload({ token }) {
    const [selectedImage, setSelectedImage] = useState('');
    const fileInputRef = useRef(null);

  useEffect(() => {
    const storedImage = localStorage.getItem('selectedImage');
    if (storedImage) {
      setSelectedImage(storedImage);
    }
  }, []);

  const handleImageUpload = async (event) => {
    console.log('handleImageUpload called');
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:8000/api/authors/avatar', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const imageResponse = await response.json();

        setSelectedImage(imageResponse.href);
        console.log(imageResponse, 'avatar')

        localStorage.setItem('selectedImage', imageResponse.href);
      } else {
        console.error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };




return (
 <>
   <div>
        {selectedImage && (
                <img className="profile-image" src={selectedImage} alt="Profile" />
              )}
           <button
                className="profile-image-label"
                style={{ opacity: selectedImage ? 0.1 : 1 }}
                onClick={() => fileInputRef.current.click()}
              >
                Select Image
           </button>
            <input
                ref={fileInputRef}
                type="file"
                id="profileImageInput"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
     </div>
</>

  );
}

export default AvatarUpload;
