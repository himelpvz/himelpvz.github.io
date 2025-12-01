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

// In a real app, this would be an API call.
// Here we use localStorage to simulate persistence for the user demo.

export const getPosts = (): BlogPost[] => {
  const localPostsJson = localStorage.getItem('blog_posts');
  const localPosts = localPostsJson ? JSON.parse(localPostsJson) : [];
  
  // Merge initial posts with user created local posts
  // We also need to apply stored reactions to the initial posts if they aren't in the object yet
  const reactions = getReactions();
  
  const allPosts = [...localPosts, ...INITIAL_POSTS];
  
  return allPosts.map(post => {
    // Apply dynamic like/dislike counts from local storage if simplified
    // For this demo, we'll just return them as is, plus any reaction modifications
    // (In a real backend, the backend serves the count. Here we cheat a bit for the UI)
    const postReactions = reactions[post.id] || { userReaction: null, deltaLikes: 0, deltaDislikes: 0 };
    return {
      ...post,
      likes: post.likes + (postReactions.deltaLikes || 0),
      dislikes: post.dislikes + (postReactions.deltaDislikes || 0)
    };
  });
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
    author: 'Himel Parvez' // Hardcoded admin
  };

  const localPostsJson = localStorage.getItem('blog_posts');
  const localPosts = localPostsJson ? JSON.parse(localPostsJson) : [];
  
  const updatedPosts = [newPost, ...localPosts];
  localStorage.setItem('blog_posts', JSON.stringify(updatedPosts));
  
  return newPost;
};

// Reactions System
// We store: { [postId]: { type: 'like' | 'dislike' } } for the user
// And we store a "delta" to simulate global counter updates locally

interface ReactionStorage {
  [postId: string]: {
    userReaction: 'like' | 'dislike' | null;
    deltaLikes: number;
    deltaDislikes: number;
  }
}

const getReactions = (): ReactionStorage => {
  const json = localStorage.getItem('blog_reactions');
  return json ? JSON.parse(json) : {};
};

export const toggleReaction = (postId: string, type: 'like' | 'dislike') => {
  const reactions = getReactions();
  const current = reactions[postId] || { userReaction: null, deltaLikes: 0, deltaDislikes: 0 };
  
  if (current.userReaction === type) {
    // Remove reaction
    if (type === 'like') current.deltaLikes--;
    if (type === 'dislike') current.deltaDislikes--;
    current.userReaction = null;
  } else {
    // Remove old reaction if exists
    if (current.userReaction === 'like') current.deltaLikes--;
    if (current.userReaction === 'dislike') current.deltaDislikes--;
    
    // Add new reaction
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