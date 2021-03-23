import React, { PureComponent } from 'react';
import { PullToRefresh, ListView, Button } from 'antd-mobile';
import LoadingFooter from './LoadingFooter';
import ProCard from '@ant-design/pro-card';
import { getFetch } from "@/utils/doFetch";


class Mcard extends PureComponent {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
            isLoading: true,
            scrolltop: 0,
            refreshing: false,
            dataArr: [],
            isEmpty: false,
            params: {
                pageIndex: 1,
                ...props.extraparams
            },
        };
    }

    //获取一段分页数据
    getsectiondata(params) {
        let { path } = this.props;
        if (!path) {
            return
        } else {
            getFetch({url:path,params:this.state.params}).then((res) => {
                if (!res.data) {
                    return;
                }
                let list = res.data.list || res.data.dataList;
                let dataArr = this.state.dataArr.concat(list);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(dataArr),
                    isLoading: false,
                    refreshing: false,
                    hasMore: res.data.hasnextpage,
                    dataArr,
                    isEmpty: params.pageIndex == 1 && list.length == 0,
                });
            });
        }

    }

    componentDidMount() {
        this.getsectiondata(this.state.params);
    }

    onRefresh = () => {
        this.setState(
            {
                refreshing: true,
                isLoading: true,
                hasMore: true,
                dataArr: [],
                params: {
                    pageIndex: 1,
                },
            },
            () => {
                this.getsectiondata(this.state.params);
            },
        );
    };

    onEndReached = (event) => {
        if (this.state.isLoading || !this.state.hasMore) {
            return;
        }
        let pageIndex = this.state.params.pageIndex + 1;
        this.setState(
            {
                isLoading: true,
                params: {
                    pageIndex,
                },
            },
            () => {
                this.getsectiondata(this.state.params);
            },
        );
    };

    render() {
        let {
            scrolltop,
            dataSource,
            isLoading,
            refreshing,
            hasMore,
            isEmpty,
        } = this.state;
        console.log(dataSource)

        return (
            <ListView
                ref={(el) => (this.lv = el)}
                dataSource={dataSource}
                renderHeader={() => (
                    <Button>sada</Button>
                )}
                renderFooter={() => (
                    <LoadingFooter
                        isLoading={isLoading && hasMore}
                        isEmpty={isEmpty}
                    ></LoadingFooter>
                )}
                renderRow={(rowData) => {
                    return <ProCard style={{ width: 300 }}>
                        {rowData.country}
                  </ProCard>
                }}
                renderSeparator={(sectionID, rowID) => (
                    <div
                        key={`${sectionID}-${rowID}`}
                        style={{
                            backgroundColor: '#F5F5F9',
                            height: 8,
                        }}
                    />
                )}
                style={{
                    overflow: 'auto',
                    height:"100%",
                    minHeight:"60vh"
                }}
                className={scrolltop > 0 ? 'notrans' : 'trans'}
                pageSize={10}
                onScroll={(e) => {
                    this.setState({
                        scrolltop: e.target.scrollTop,
                    });
                    if (e.target.scrollTop > 400) {
                    } else {
                    }
                }}
                scrollRenderAheadDistance={800}
                distanceToRefresh={window.devicePixelRatio * 25}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={10}
                pullToRefresh={
                    <PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />
                }
            />
        );
    }
}

export default Mcard
