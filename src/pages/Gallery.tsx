import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { collections } from "@/lib/photos";
import "./Gallery.css";

const Gallery = () => (
  <div className="gallery-page">
    <Header />
    <main id="main-content" className="page-width">
      <div className="gallery-intro journal-intro">
        <h1>Photo <br /><em>journal</em></h1>
        <div className="gallery-intro-aside"><p>Still figuring it out</p><span className="camera-note">Was shooting with D610, now Z6III (11/26)</span><a href="#collections" className="text-link">Browse collections <ArrowDown size={16} /></a></div>
      </div>
      <section id="collections" className="collections-section" aria-labelledby="collections-title">
        <div className="section-rule"><h2 id="collections-title">Collections</h2><span>{String(collections.length).padStart(2, "0")} collections / {String(collections.reduce((sum, album) => sum + album.photos.length, 0)).padStart(2, "0")} photographs</span></div>
        <div className="collection-grid journal-collections">
          {collections.map((album, index) => (
            <Link key={album.slug} to={`/gallery/${album.slug}`} className="collection-card">
              <div className="collection-cover"><img src={album.cover.thumbnailSrc ?? album.cover.src} alt={album.cover.alt} width={album.cover.width} height={album.cover.height} loading={index === 0 ? "eager" : "lazy"} decoding="async" /><span className="collection-open" aria-hidden="true"><ArrowUpRight size={24} /></span></div>
              <div className="collection-caption"><div><h3>{album.title}</h3><span>{album.photos.length} photographs</span></div><ArrowUpRight size={22} aria-hidden="true" /></div>
            </Link>
          ))}
        </div>
        {collections.length === 0 && <p className="section-note">The first collection is on its way.</p>}
      </section>
      <p className="journal-end">Ongoing collection<br /><span>More moments to come.</span></p>
    </main>
    <Footer />
  </div>
);

export default Gallery;
