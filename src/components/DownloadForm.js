import { AnimatePresence, motion } from 'framer-motion';
import { Download, FileVideo, Info } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { useUser } from '../contexts/UserContext';

const DownloadSection = styled.div`
  max-width: 600px;
  margin: 3rem auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    margin: 2rem auto;
    padding: 1.5rem;
  }
`;

const UrlInputGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const UrlInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #6c757d;
  }
`;

const ProgressContainer = styled.div`
  margin-top: 2rem;
  display: ${props => props.show ? 'block' : 'none'};
`;

const VideoInfoCard = styled(motion.div)`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border: 2px solid #e9ecef;
`;

const VideoThumbnail = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  .placeholder {
    color: white;
    font-size: 3rem;
  }
`;

const VideoDetails = styled.div`
  .meta, h3 {
    display: flex;
    gap: 1rem;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .description {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
`;

const QualityOptions = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const QualityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const QualityOption = styled(motion.div)`
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
  }

  .quality-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .quality-name {
    font-weight: 600;
    color: #333;
  }

  .quality-badge {
    background: #667eea;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .quality-details {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .download-btn {
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
`;


function DownloadForm() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // const [downloadedFiles, setDownloadedFiles] = useState([]);
  
  const {
    // trialDaysRemaining,
    // isSubscribed,
    // downloadsToday,
    // saveLocation,
    isDownloading,
    downloadProgress,
    // incrementDownloads,
    // showTrialExpiredModal,
    // // showSubscriptionModal,
    // setDownloadProgress,
  } = useUser();

  const isValidVideoUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const validDomains = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com', 'twitch.tv', 'facebook.com'];
      return validDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  const analyzeVideo = async () => {
    if (!videoUrl.trim()) {
      toast.error('Please enter a video URL');
      return;
    }

    if (!isValidVideoUrl(videoUrl)) {
      toast.error('Please enter a valid video URL from supported platforms');
      return;
    }

    try {
      setIsAnalyzing(true);

      const response = await fetch('https://filtaserverless.onrender.com/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: videoUrl })
      })

      if (!response.ok) {
        toast.error('Failed to analyze video. Please try again.');
        return;
      }

      const data = await response.json();
  
      const videoInfo = {
        title: data.title,
        duration: data.duration,
        thumbnail: data.thumbnail, // We'll use a placeholder
        description: data.description,
        downloadUrl: data.direct_link,
        qualities: [
          {
            id: data.job_id,
            name: data.format_id === 'hd' ? '4K Ultra HD' : data.format_id,
            size: data.filesize === '0.00 MB' ? 'Unknown' : data.filesize,
            format: data.extension,
            direct_link: data.direct_link,
            description: data.description,
          }
        ]
      };
      
      setVideoInfo(videoInfo);
      toast.success('Video analyzed successfully!');
    } catch (error) {
      toast.error('Failed to analyze video. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // const downloadQuality = async (quality) => {
  //   // Check trial/subscription status
  //   if (!isSubscribed && trialDaysRemaining <= 0) {
  //     showTrialExpiredModal();
  //     return;
  //   }

  //   // Check daily download limits for trial users
  //   if (!isSubscribed && downloadsToday >= 10) {
  //     toast.error('Daily download limit reached (10 downloads). Upgrade to Premium for unlimited downloads.');
  //     setTimeout(() => {
  //       document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
  //     }, 1000);
  //     return;
  //   }

  //   if (!saveLocation.trim()) {
  //     toast.error('Please select a save location');
  //     return;
  //   }

  //   await startDownload(quality);
  // };

  // const startDownload = async (quality) => {
  //   setDownloadProgress(true, 0);
    
  //   // Simulate download progress
  //   const duration = 3000 + Math.random() * 2000; // 3-5 seconds
  //   const interval = 50;
  //   const steps = duration / interval;
  //   let currentStep = 0;

  //   const progressInterval = setInterval(() => {
  //     currentStep++;
  //     const progress = Math.min((currentStep / steps) * 100, 100);
  //     setDownloadProgress(true, progress);

  //     if (progress >= 100) {
  //       clearInterval(progressInterval);
  //       completeDownload(quality);
  //     }
  //   }, interval);
  // };

  // const completeDownload = (quality) => {
  //   // Update download count
  //   if (!isSubscribed) {
  //     incrementDownloads();
  //   }

  //   // Create download file info
  //   // const fileName = `${videoInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}_${quality.name.replace(/\s+/g, '_')}.${quality.format.toLowerCase()}`;
  //   // const downloadedFile = {
  //   //   id: Date.now(),
  //   //   name: fileName,
  //   //   quality: quality.name,
  //   //   size: quality.size,
  //   //   format: quality.format,
  //   //   downloadUrl: videoInfo.downloadUrl,
  //   //   downloadTime: new Date().toLocaleString()
  //   // };

  //   // setDownloadedFiles(prev => [downloadedFile, ...prev]);
    
  //   // Show success message
  //   toast.success(`${quality.name} quality downloaded successfully!`);
    
  //   // Hide progress after delay
  //   setTimeout(() => {
  //     setDownloadProgress(false, 0);
  //   }, 2000);
  // };

  const downloadFile = async (file) => {
    try {
      const fileName = `${videoInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}_${videoInfo.qualities[0].name.replace(/\s+/g, '_')}.${videoInfo.qualities[0].format.toLowerCase()}`;
      const response = await fetch(file.downloadUrl);
  
      if (!response.ok) throw new Error('Download failed');
  
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
  
      console.log(fileName)
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      window.URL.revokeObjectURL(blobUrl);
      toast.success('Download started!');
    } catch (err) {
      toast.error('Download failed.');
    }
  };

  // const copyDownloadLink = (file) => {
  //   navigator.clipboard.writeText(file.downloadUrl);
  //   toast.success('Download link copied to clipboard!');
  // };

  // const resetForm = () => {
  //   setVideoUrl('');
  //   setVideoInfo(null);
  //   // setDownloadedFiles([]);
  // };

  return (
    <DownloadSection>
      <UrlInputGroup>
        <UrlInput
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste video URL here (YouTube, Vimeo, etc.)..."
          disabled={isAnalyzing || isDownloading}
        />
        <button 
          className="btn btn-primary btn-large"
          onClick={analyzeVideo}
          disabled={isAnalyzing || isDownloading}
        >
          {isAnalyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Info size={20} />
              </motion.div>
              Analyzing...
            </>
          ) : (
            <>
              <Info size={20} />
              Analyze
            </>
          )}
        </button>
      </UrlInputGroup>

      <AnimatePresence>
        {videoInfo && (
          <VideoInfoCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <VideoThumbnail>
              {videoInfo.thumbnail ? (
                <img src={videoInfo.thumbnail} alt="Video thumbnail" />
              ) : (
                <FileVideo className="placeholder" size={60} />
              )}
            </VideoThumbnail>
            
            <VideoDetails>
              <h3>{videoInfo.title}</h3>
              <div className="meta">
                <span>Duration: {videoInfo.duration}</span>
              </div>
            </VideoDetails>
            <QualityOptions>
              <QualityGrid>
                  <QualityOption
                    key={videoInfo.qualities[0].id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="quality-header">
                      <span className="quality-name">{videoInfo.qualities[0].name}</span>
                      <span className="quality-badge">{videoInfo.qualities[0].format}</span>
                    </div>
                    <div className="file-actions">
                      <button
                        className="download-btn"
                        onClick={() => downloadFile(videoInfo)}
                      >
                        <Download size={16} />
                        Download {videoInfo.qualities[0].description}
                      </button>
                    </div>
                  </QualityOption>
              </QualityGrid>
            </QualityOptions>
          </VideoInfoCard>
        )}
      </AnimatePresence>

      <ProgressContainer show={isDownloading}>
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${downloadProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="progress-text">
          Downloading... {Math.round(downloadProgress)}%
        </div>
      </ProgressContainer>
    </DownloadSection>
  );
}

export default DownloadForm;
