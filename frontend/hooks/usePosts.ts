import api from '../services/api';
import { useQuery } from '@tanstack/react-query';

export const useFeed = (filter: string = 'hot', page: number = 1) => {
    return useQuery({
        queryKey: ['feed', filter, page],
        queryFn: async () => {
            const { data } = await api.get(`/posts/feed`, {
                params: { filter, page, limit: 15 }
            });
            return data;
        }
    });
};

export const usePost = (postId: string) => {
    return useQuery({
        queryKey: ['post', postId],
        queryFn: async () => {
            if (!postId) return null;
            const { data } = await api.get(`/posts/${postId}`);
            return data;
        },
        enabled: !!postId
    });
};

export const useComments = (postId: string) => {
    return useQuery({
        queryKey: ['comments', postId],
        queryFn: async () => {
            if (!postId) return [];
            const { data } = await api.get(`/comments/${postId}`);
            return data;
        },
        enabled: !!postId
    });
};
