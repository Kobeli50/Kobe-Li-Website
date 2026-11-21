import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhotoGrid from "@/components/PhotoGrid";
import { albums, collections, formatPhotoDate } from "@/lib/photos";
import NotFound from "./NotFound";

const Album = () => {
  const { slug } = useParams();
  const theme = collections.find((collection) => collection.slug === slug);
  const navigation = theme ? collections : albums;
  const albumIndex = navigation.findIndex((album) => album.slug === slug);
  const album = navigation[albumIndex];
  if (!album) return <NotFound />;
  const nextAlbum = navigation[(albumIndex + 1) % navigation.length];

  return (
    <div className="album-page">
      <Header />
      <main id="main-content" className="page-width">
        <Link to="/gallery" className="text-link back-link"><ArrowLeft size={16} /> All collections</Link>
        <div className="album-heading"><p className="eyebrow">Photo journal / {theme ? String(albumIndex + 1).padStart(2, "0") : "By date"}</p><h1>{album.title}</h1><div><span>{album.photos.length} {album.photos.length === 1 ? "photograph" : "photographs"}{theme && album.date && <> · <time dateTime={album.date}>{formatPhotoDate(album.date)}</time></>}</span><span>Click any frame to explore</span></div></div>
        <PhotoGrid key={album.slug} photos={album.photos} />
        {navigation.length > 1 && <Link to={`/gallery/${nextAlbum.slug}`} className="next-collection"><div><span className="eyebrow">Next collection</span><h2>{nextAlbum.title}</h2></div><ArrowUpRight size={32} /></Link>}
      </main>
      <Footer />
    </div>
  );
};

export default Album;
