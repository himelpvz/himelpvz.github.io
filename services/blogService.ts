import { BlogPost, BlogReaction } from '../types';

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Building TWRP for Redmi Note 12 (sunstone)',
    excerpt: 'A comprehensive guide on bringing up Team Win Recovery Project for the Snapdragon 4 Gen 1 device.',
    content: `
# Building TWRP for Sunstone

The Redmi Note 12 5G (sunstone) presents some unique challenges when compiling recovery due to its dynamic partition scheme.

## Prerequisites

- A Linux environment (Ubuntu 20.04+)
- Basic knowledge of git and bash
- Reliable internet connection

## The Device Tree

You can find the device tree in my GitHub repository. The structure is standard for Qualcomm devices, but pay attention to the \`BoardConfig.mk\` flags.

| Flag | Value | Description |
|------|-------|-------------|
| \`TW_INCLUDE_CRYPTO\` | \`true\` | Enables encryption support |
| \`TW_THEME\` | \`portrait_hdpi\` | Sets UI resolution |

\`\`\`bash
repo init -u https://github.com/minimal-manifest-twrp/platform_manifest_twrp_aosp.git -b twrp-12.1
repo sync
\`\`\`

## Key Fixes

One of the major issues was decryption. This was solved by properly including the \`qcom_decrypt\` libraries and ensuring the vendor blobs matched the Android 12 baseline.

### Decryption Flags

Make sure you have these in your board config:

\`\`\`makefile
TW_INCLUDE_CRYPTO := true
TW_INCLUDE_CRYPTO_FBE := true
TW_INCLUDE_FBE_METADATA_DECRYPT := true
\`\`\`

- [x] Fix Decryption
- [x] Fix Touch
- [ ] Fix Vibration

## Conclusion

With these changes, the recovery is stable and can decrypt user data successfully. Happy flashing!
    `,
    coverImage: 'https://images.unsplash.com/photo-1615832793616-e5c777d066b5?q=80&w=1000&auto=format&fit=crop',
    date: '2023-10-15',
    tags: ['TWRP', 'Android', 'Development', 'Sunstone'],
    author: 'Himel Parvez',
    likes: 24,
    dislikes: 1
  },
  {
    id: '2',
    title: 'Understanding Android Verified Boot (AVB)',
    excerpt: 'Why your device goes into a bootloop after modifying partition images and how to fix it.',
    content: `
# Android Verified Boot 2.0

Android Verified Boot (AVB) is a security feature that ensures the integrity of the operating system software.

## How it works

It uses cryptographic hashes to verify the integrity of each partition (boot, dtbo, vendor, system, etc.). If you modify a partition without updating the hash in the \`vbmeta\` partition, the bootloader will refuse to boot.

## Disabling AVB

For development purposes, we often need to disable verification. This is done by flashing a patched \`vbmeta\` image.

\`\`\`bash
fastboot --disable-verity --disable-verification flash vbmeta vbmeta.img
\`\`\`

> **Warning:** Doing this compromises the security of your device. Only do this on devices with unlocked bootloaders intended for development.

## Common Pitfalls

1. **Vbmeta Mismatch**: Flashing a vbmeta from a different ROM version.
2. **Empty Vbmeta**: Using a zeroed out image isn't always the solution on newer Snapdragon chips.

Stay safe and always backup your partitions!
    `,
    coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop',
    date: '2023-11-02',
    tags: ['AVB', 'Security', 'Android'],
    author: 'Himel Parvez',
    likes: 42,
    dislikes: 0
  }
];

// Helper to get local storage posts
const getLocalPosts = (): BlogPost[] => {
  try {
    const json = localStorage.getItem('blog_posts');
    return json ? JSON.parse(json) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalPosts = (posts: BlogPost[]) => {
  localStorage.setItem('blog_posts', JSON.stringify(posts));
};

export const getPosts = (): BlogPost[] => {
  const localPosts = getLocalPosts();
  const reactions = getReactions();
  const deletedIds = getDeletedIds();
  
  const allPostsMap = new Map<string, BlogPost>();
  
  INITIAL_POSTS.forEach(p => {
    if (!deletedIds.includes(p.id)) {
      allPostsMap.set(p.id, p);
    }
  });
  
  localPosts.forEach(p => {
    if (!deletedIds.includes(p.id)) {
      allPostsMap.set(p.id, p);
    }
  });

  const allPosts = Array.from(allPostsMap.values());
  
  return allPosts.map(post => {
    const postReactions = reactions[post.id] || { userReaction: null, deltaLikes: 0, deltaDislikes: 0 };
    return {
      ...post,
      likes: post.likes + (postReactions.deltaLikes || 0),
      dislikes: post.dislikes + (postReactions.deltaDislikes || 0)
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getPostById = (id: string): BlogPost | undefined => {
  return getPosts().find(p => p.id === id);
};

export const createPost = (post: Omit<BlogPost, 'id' | 'date' | 'likes' | 'dislikes' | 'author'>): BlogPost => {
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    likes: 0,
    dislikes: 0,
    author: 'Himel Parvez'
  };

  const localPosts = getLocalPosts();
  const updatedPosts = [newPost, ...localPosts];
  saveLocalPosts(updatedPosts);
  
  return newPost;
};

export const updatePost = (id: string, postData: Partial<BlogPost>): BlogPost | null => {
  const posts = getPosts();
  const existingPost = posts.find(p => p.id === id);
  
  if (!existingPost) return null;
  
  const updatedPost = { ...existingPost, ...postData };
  
  // We need to save this to local storage. 
  // If it was an initial post, it now becomes a local post (conceptually, to persist changes).
  const localPosts = getLocalPosts();
  const localIndex = localPosts.findIndex(p => p.id === id);
  
  if (localIndex >= 0) {
    localPosts[localIndex] = updatedPost;
  } else {
    localPosts.push(updatedPost);
  }
  
  saveLocalPosts(localPosts);
  return updatedPost;
};

const getDeletedIds = (): string[] => {
  try {
    const json = localStorage.getItem('deleted_posts');
    return json ? JSON.parse(json) : [];
  } catch (e) {
    return [];
  }
};

export const deletePost = (id: string) => {
  const localPosts = getLocalPosts();
  const filteredLocal = localPosts.filter(p => p.id !== id);
  saveLocalPosts(filteredLocal);
  
  const deletedIds = getDeletedIds();
  if (!deletedIds.includes(id)) {
    deletedIds.push(id);
    localStorage.setItem('deleted_posts', JSON.stringify(deletedIds));
  }
};

export const getBlogStats = () => {
  const posts = getPosts();
  const totalLikes = posts.reduce((acc, curr) => acc + curr.likes, 0);
  const totalViews = posts.length * 125 + totalLikes * 5; // Fake view count algo
  
  return {
    totalPosts: posts.length,
    totalLikes,
    totalViews
  };
};

// Reactions System
interface ReactionStorage {
  [postId: string]: {
    userReaction: 'like' | 'dislike' | null;
    deltaLikes: number;
    deltaDislikes: number;
  }
}

const getReactions = (): ReactionStorage => {
  try {
    const json = localStorage.getItem('blog_reactions');
    return json ? JSON.parse(json) : {};
  } catch (e) {
    return {};
  }
};

export const toggleReaction = (postId: string, type: 'like' | 'dislike') => {
  const reactions = getReactions();
  const current = reactions[postId] || { userReaction: null, deltaLikes: 0, deltaDislikes: 0 };
  
  if (current.userReaction === type) {
    // Toggle off
    if (type === 'like') current.deltaLikes--;
    if (type === 'dislike') current.deltaDislikes--;
    current.userReaction = null;
  } else {
    // Switch or toggle on
    if (current.userReaction === 'like') current.deltaLikes--;
    if (current.userReaction === 'dislike') current.deltaDislikes--;
    
    if (type === 'like') current.deltaLikes++;
    if (type === 'dislike') current.deltaDislikes++;
    current.userReaction = type;
  }
  
  reactions[postId] = current;
  localStorage.setItem('blog_reactions', JSON.stringify(reactions));
  return current;
};

export const getUserReaction = (postId: string): 'like' | 'dislike' | null => {
  const reactions = getReactions();
  return reactions[postId]?.userReaction || null;
};