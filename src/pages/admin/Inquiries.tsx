import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inquiriesApi, Inquiry } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Mail, MailOpen, ChevronLeft, ChevronRight, Download, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Inquiries = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const itemsPerPage = 50;

  // Fetch inquiries
  const { data, isLoading } = useQuery({
    queryKey: ['inquiries', searchQuery, currentPage],
    queryFn: () =>
      inquiriesApi.getAll({
        search: searchQuery || undefined,
        page: currentPage,
        limit: itemsPerPage,
      }),
  });

  const inquiries = data?.data || [];
  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  // Update read status mutation
  const updateReadMutation = useMutation({
    mutationFn: ({ id, is_read }: { id: string; is_read: boolean }) =>
      inquiriesApi.updateReadStatus(id, is_read),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      toast({
        title: 'Success',
        description: 'Inquiry status updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update inquiry status',
        variant: 'destructive',
      });
    },
  });

  // Delete inquiry mutation
  const deleteAllMutation = useMutation({
    mutationFn: () => inquiriesApi.deleteAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      toast({
        title: 'Success',
        description: 'All inquiries deleted successfully',
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete inquiries',
        variant: 'destructive',
      });
    },
  });

  const handleOpenDetail = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDetailOpen(true);
    
    // Mark as read if not already read
    if (!inquiry.is_read) {
      updateReadMutation.mutate({ id: inquiry.id, is_read: true });
    }
  };

  const handleToggleRead = (inquiry: Inquiry, e: React.MouseEvent) => {
    e.stopPropagation();
    updateReadMutation.mutate({ id: inquiry.id, is_read: !inquiry.is_read });
  };

  const handleConfirmDeleteAll = () => {
    deleteAllMutation.mutate();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownloadExcel = () => {
    if (inquiries.length === 0) {
      toast({
        title: 'No data',
        description: 'There are no inquiries to export',
        variant: 'destructive',
      });
      return;
    }

    // Create CSV content with proper formatting for phone numbers
    const headers = ['Customer Name', 'Phone Number'];
    const rows = inquiries.map(inquiry => [
      inquiry.customer_name,
      `="${inquiry.phone_number}"`, // Force Excel to treat as text
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Success',
      description: 'Inquiries exported successfully',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-600 mt-2">Manage customer inquiries</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleDownloadExcel}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Excel
          </Button>
          {inquiries.length > 0 && (
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* Inquiries List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              {searchQuery ? 'No inquiries found matching your search.' : 'No inquiries yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            {inquiries.map((inquiry) => (
              <Card
                key={inquiry.id}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  !inquiry.is_read ? 'border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => handleOpenDetail(inquiry)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={(e) => handleToggleRead(inquiry, e)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {inquiry.is_read ? (
                          <MailOpen className="h-5 w-5" />
                        ) : (
                          <Mail className="h-5 w-5 text-blue-500" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {inquiry.customer_name}
                          </h3>
                          {!inquiry.is_read && (
                            <Badge variant="default" className="bg-blue-500">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{inquiry.phone_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {formatDate(inquiry.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({data?.total} total inquiries)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inquiry Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>
              Customer inquiry received on {selectedInquiry && formatDate(selectedInquiry.created_at)}
            </DialogDescription>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Customer Name</label>
                <p className="text-gray-900 mt-1">{selectedInquiry.customer_name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                <p className="text-gray-900 mt-1">{selectedInquiry.phone_number}</p>
              </div>
              {selectedInquiry.message && (
                <div>
                  <label className="text-sm font-semibold text-gray-700">Message</label>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                    {selectedInquiry.message}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <div className="mt-1">
                  {selectedInquiry.is_read ? (
                    <Badge variant="secondary">Read</Badge>
                  ) : (
                    <Badge variant="default" className="bg-blue-500">Unread</Badge>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateReadMutation.mutate({
                      id: selectedInquiry.id,
                      is_read: !selectedInquiry.is_read,
                    });
                  }}
                  disabled={updateReadMutation.isPending}
                >
                  {updateReadMutation.isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Mark as {selectedInquiry.is_read ? 'Unread' : 'Read'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Inquiries</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all inquiries? This will permanently remove all {data?.total || 0} inquiries from the database. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteAll}
              className="bg-red-500 hover:bg-red-600"
              disabled={deleteAllMutation.isPending}
            >
              {deleteAllMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Inquiries;
